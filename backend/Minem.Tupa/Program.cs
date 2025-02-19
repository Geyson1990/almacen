using Microsoft.EntityFrameworkCore;
using Minem.Tupa.Api.GraphQL;
using Minem.Tupa.Api.HubConfig;
using Minem.Tupa.Automapper;
using Minem.Tupa.Data;
using Minem.Tupa.Register.IoC;
using Minem.Tupa.Utils;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
//CustomExtensions.AddPersistenceServices(builder.Services, builder.Configuration.GetValue<string>("ConnectionStrings:ContextMinem"));
IoCRegisterExtensions.AddCustomIntegration(builder.Services);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<Minem_Db_Context>(options => options.UseOracle(builder.Configuration.GetConnectionString("ContextMinem")));
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

builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

builder.Services.AddSignalR();

//builder.Services.AddAuthentication(opt =>
//{
//    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//}).AddJwtBearer(options =>
//{
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,

//        ValidIssuer = builder.Configuration["Jwt:Issuer"],
//        ValidAudience = builder.Configuration["Jwt:Issuer"],
//        LifetimeValidator = TokenLifetimeValidator.Validate,
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
//    };
//    options.Events = new JwtBearerEvents
//    {
//        OnMessageReceived = context =>
//        {
//            var accessToken = context.Request.Query["access_token"];
//            if (!string.IsNullOrEmpty(accessToken))
//            {
//                context.Token = accessToken;
//            }
//            return Task.CompletedTask;
//        }
//    };
//});

var app = builder.Build();

app.MapGraphQL();
app.MapHub<TupaHub>("/tupaHub");

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
