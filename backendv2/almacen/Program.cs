using almacen.Repositories.Autenticacion;
using almacen.Repositories.Ingreso;
using almacen.Repositories.Inventario;
using almacen.Utils;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Configurar sesión de base de datos
builder.Services.AddTransient<IDbSession, DbSession>(_ =>
    new DbSession(builder.Configuration.GetRequiredSection("ConnectionStrings:Context").Value!));

//Registrar Repositorios
builder.Services.AddTransient<IAutenticacionRepository, AutenticacionRepository>();
builder.Services.AddTransient<IInventarioRepository, InventarioRepository>();
builder.Services.AddTransient<IIngresoRepository, IngresoRepository>();

var valuesSection = builder.Configuration
                .GetSection("Cors:AllowedHost")
                .Get<List<string>>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.WithOrigins(valuesSection?.ToArray() ?? [])
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("CorsPolicy");

app.Run();
