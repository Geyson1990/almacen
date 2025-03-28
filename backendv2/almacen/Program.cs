using almacen.Repositories.Autenticacion;
using almacen.Repositories.Ingreso;
using almacen.Repositories.Inventario;
using almacen.Repositories.Reporte;
using almacen.Repositories.Salida;
using almacen.Utils;

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
builder.Services.AddTransient<ISalidaRepository, SalidaRepository>();
builder.Services.AddTransient<IReporteRepository, ReporteRepository>();

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

//builder.Services.AddControllers()
//    .AddJsonOptions(options =>
//    {
//        options.JsonSerializerOptions.PropertyNamingPolicy = null;
//        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
//        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
//    });

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("CorsPolicy");

app.Run();
