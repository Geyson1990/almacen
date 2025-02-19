using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minem.Tupa.Application;
using Minem.Tupa.Data;
using Minem.Tupa.IApplication;
using Minem.Tupa.IRepository;
using Minem.Tupa.Proxy.Implementation;
using Minem.Tupa.Proxy.Interface;
using Minem.Tupa.Repository;

namespace Minem.Tupa.Register.IoC
{
    public static class IoCRegisterExtensions
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, string connectionString)
        {            
            services.AddDbContext<Minem_Db_Context>(options =>
                options.UseOracle(connectionString, b => b.UseOracleSQLCompatibility(OracleSQLCompatibility.DatabaseVersion19))
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
            services.AddSingleton(new ArchivoApplication(filePath));
            return services;
        }

        public static IServiceCollection AddRegisterApplications(IServiceCollection services)
        {
            services.AddScoped<IAutenticacionApplication, AutenticacionApplication>();
            services.AddScoped<IRequisitoApplication, RequisitoApplication>();
            services.AddScoped<ISectorApplication, SectorApplication>();
            services.AddScoped<ITramiteApplication, TramiteApplication>();
            services.AddScoped<ITupaApplication, TupaApplication>();
            //services.AddScoped<IArchivoApplication, ArchivoApplication>();
            services.AddScoped<IFormularioApplication, FormularioApplication>();
            services.AddScoped<IObservacionApplication, ObservacionApplication>();
            services.AddScoped<IMapaApplication, MapaApplication>();
            return services;
        }

        public static IServiceCollection AddRegisterRepositories(IServiceCollection services)
        {
            services.AddScoped<IAutenticacionRepository, AutenticacionRepository>();
            services.AddScoped<IRequisitoRepository, RequisitoRepository>();
            services.AddScoped<ISectorRepository, SectorRepository>();
            services.AddScoped<ITramiteRepository, TramiteRepository>();
            services.AddScoped<ITupaRepository, TupaRepository>();
            services.AddScoped<IArchivoRepository, ArchivoRepository>();
            services.AddScoped<IFormularioRepository, FormularioRepository>();
            services.AddScoped<IObservacionRepository, ObservacionRepository>();
            services.AddScoped<IMapaRepository, MapaRepository>();
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
