using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Muni.Almacen.Application;
using Muni.Almacen.Data;
using Muni.Almacen.IApplication;
using Muni.Almacen.IRepository;
using Muni.Almacen.Repository;

namespace Muni.Almacen.Register.IoC
{
    public static class IoCRegisterExtensions
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, string connectionString)
        {            
            services.AddDbContext<Minem_Db_Context>(options =>
                options.UseSqlServer(connectionString)
            );

            return services;
        }

        public static IServiceCollection AddCustomIntegration(this IServiceCollection services)
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Plantilla");

            AddRegisterApplications(services);
            AddRegisterRepositories(services);
            //AddRegisterProxy(services);
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //services.AddSingleton(new ArchivoApplication(filePath));
            return services;
        }

        public static IServiceCollection AddRegisterApplications(IServiceCollection services)
        {
            services.AddScoped<IAutenticacionApplication, AutenticacionApplication>();
            services.AddScoped<IFormularioApplication, FormularioApplication>();
            return services;
        }

        public static IServiceCollection AddRegisterRepositories(IServiceCollection services)
        {
            services.AddScoped<IAutenticacionRepository, AutenticacionRepository>();
            services.AddScoped<IFormularioRepository, FormularioRepository>();
            return services;
        }

        //public static IServiceCollection AddRegisterProxy(IServiceCollection services)
        //{
        //    services.AddScoped<IExternoService, ExternoService>();
        //    return services;
        //}

        //public static IServiceCollection AddHttpClientConfig(this IServiceCollection services, IConfiguration configuration)
        //{
        //    services.AddHttpClient<IExternoService, ExternoService>(httpClient =>
        //    {
        //        var settings = configuration.GetSection($"{Constante.KeyAppConfig.MsSettings}:{Constante.KeyAppConfig.ExternoSvcSettings}").Get<ExternoSvcSettings>();
        //        httpClient.BaseAddress = new Uri(settings.BaseUrl);
        //        httpClient.Timeout = TimeSpan.FromSeconds(settings.TimeoutSeconds);
        //    }).ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
        //    {
        //        ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
        //    });
        //    return services;
        //}
    }
}
