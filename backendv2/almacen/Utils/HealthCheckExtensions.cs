using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Net.Mime;
using System.Text.Json;
using static almacen.Utils.Message;

namespace almacen.Utils
{
    public static class HealthCheckExtensions
    {
        public static IEndpointConventionBuilder MapCustomHealthChecks(this IEndpointRouteBuilder endpoints, string serviceName)
        {
            return endpoints.MapHealthChecks("/healthcheck", new HealthCheckOptions
            {
                ResponseWriter = async (context, report) =>
                {
                    var options = new JsonSerializerOptions
                    {
                        WriteIndented = false,
                        IgnoreNullValues = true
                    };
                    var result = JsonSerializer.Serialize(
                        new HealthResult
                        {
                            Name = serviceName,
                            Status = report.Status.ToString(),
                            Duration = report.TotalDuration,
                            Info = report.Entries.Select(e => new HealthInfo
                            {
                                Key = e.Key,
                                Description = e.Value.Description,
                                Duration = e.Value.Duration,
                                Status = Enum.GetName(typeof(HealthStatus), e.Value.Status),
                                Error = e.Value.Exception?.Message
                            }).ToList()
                        }, options);
                    context.Response.ContentType = MediaTypeNames.Application.Json;
                    await context.Response.WriteAsync(result);
                }
            });
        }

        public static IServiceCollection AddCustomMVC(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers(options =>
            {
                options.Filters.Add(typeof(HttpGlobalExceptionFilter));
                options.ModelBindingMessageProvider.SetAttemptedValueIsInvalidAccessor((x, y) => $"El campo '{y}' no es válido.");
                options.ModelBindingMessageProvider.SetValueMustNotBeNullAccessor((x) => $"El valor '{x}' es inválido.");
                options.ModelBindingMessageProvider.SetValueIsInvalidAccessor((x) => $"El valor '{x}' es inválido.");
                options.ModelBindingMessageProvider.SetValueMustBeANumberAccessor((x) => $"El campo {x} debe ser un número.");
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                builder => builder
                //.SetIsOriginAllowed((host) => true)
                .WithOrigins("*")
                .AllowAnyMethod()
                .AllowAnyHeader());
                //.AllowCredentials());
            });

            services.Configure<KestrelServerOptions>(x => x.AllowSynchronousIO = true)
           .Configure<IISServerOptions>(x => x.AllowSynchronousIO = true);

            return services;
        }

    }

    public class HealthResult
    {
        public string Name { get; set; }
        public string Status { get; set; }
        public TimeSpan Duration { get; set; }
        public ICollection<HealthInfo> Info { get; set; }
    }

    public class HealthInfo
    {
        public string Key { get; set; }
        public string Description { get; set; }
        public TimeSpan Duration { get; set; }
        public string Status { get; set; }
        public string Error { get; set; }
    }

    public class HttpGlobalExceptionFilter : IExceptionFilter, IFilterMetadata
    {
        private readonly IHostEnvironment env;
        private readonly ILogger<HttpGlobalExceptionFilter> logger;

        public HttpGlobalExceptionFilter(
          IHostEnvironment env,
          ILogger<HttpGlobalExceptionFilter> logger)
        {
            this.env = env;
            this.logger = logger;
        }

        public void OnException(ExceptionContext context)
        {
            this.logger.LogError(new EventId(context.Exception.HResult), context.Exception, context.Exception.Message);
            StatusResponse<int> statusResponse = new()
            {
                Success = false,
                Message = "Ha sucedido un error al acceder al recurso"+context.Exception.Message,
                Data = 0
            };
            if (this.env.IsDevelopment())
                statusResponse.Message = context.Exception.Message;
            if (context.Exception.GetType() == typeof(DomainException))
            {

                context.Result = new BadRequestObjectResult((object)statusResponse);
                context.HttpContext.Response.StatusCode = 400;
            }
            else
            {
                context.Result = new InternalServerErrorObjectResult((object)statusResponse);
                context.HttpContext.Response.StatusCode = 500;
            }
            context.ExceptionHandled = true;
        }
    }

    public class DomainException : Exception
    {
        public DomainException()
        {
        }

        public DomainException(string message)
          : base(message)
        {
        }

        public DomainException(string message, Exception innerException)
          : base(message, innerException)
        {
        }
    }

    public class InternalServerErrorObjectResult : ObjectResult
    {
        public InternalServerErrorObjectResult(object error)
          : base(error) => StatusCode = new int?(500);
    }
}
