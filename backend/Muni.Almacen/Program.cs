using Microsoft.EntityFrameworkCore;
using Muni.Almacen.Automapper;
using Muni.Almacen.Data;
using Muni.Almacen.Register.IoC;
using Muni.Almacen.Utils;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
//CustomExtensions.AddPersistenceServices(builder.Services, builder.Configuration.GetValue<string>("ConnectionStrings:ContextMinem"));
IoCRegisterExtensions.AddCustomIntegration(builder.Services);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<Minem_Db_Context>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ContextMinem")));
builder.Services.AddScoped<DbContext, Minem_Db_Context>();

var config = new AutoMapper.MapperConfiguration(cfg =>
{
    cfg.AddProfile(new AutoMapperProfile());
});

var mapper = config.CreateMapper();
builder.Services.AddSingleton(mapper);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
        //.WithOrigins(Constants.GetWithOriginsProgram.GetOrigins0, Constants.GetWithOriginsProgram.GetOrigins1, Constants.GetWithOriginsProgram.GetOrigins2)
        .WithOrigins(Constante.ORIGIN_WEB)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});


var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
