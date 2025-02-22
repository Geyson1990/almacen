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
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            return services;
        }

        public static IServiceCollection AddRegisterApplications(IServiceCollection services)
        {
            services.AddScoped<IAutenticacionApplication, AutenticacionApplication>();
            services.AddScoped<IInventarioApplication, InventarioApplication>();
            return services;
        }

        public static IServiceCollection AddRegisterRepositories(IServiceCollection services)
        {
            services.AddScoped<IAutenticacionRepository, AutenticacionRepository>();
            services.AddScoped<IInventarioRepository, InventarioRepository>();
            return services;
        }

    }
}
