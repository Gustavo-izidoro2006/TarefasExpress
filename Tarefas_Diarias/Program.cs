using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using TarefaExpress.Data;
using TarefaExpress.Entities;
using TarefaExpress.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(opts => {
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IGrupoService, GrupoService>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=mysql;Port=3306;Database=tarefas_diarias;User=tarefas_user;Password=jesuscristo;";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0)),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure(3));
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.EnsureCreated();

        // Garantir que as tabelas necessárias existam mesmo se o banco já existia antes
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS MembrosGrupos (
                Id CHAR(36) PRIMARY KEY,
                IdGrupo CHAR(36) NOT NULL,
                IdUsuario CHAR(36) NOT NULL,
                IdCargo CHAR(36) NOT NULL,
                Status INT NOT NULL,
                EntradaEm DATETIME(6) NOT NULL,
                SaidaEm DATETIME(6) NULL
            );
        ");
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS ItemTarefas (
                Id CHAR(36) PRIMARY KEY,
                IdGrupo CHAR(36) NOT NULL,
                IdUsuarioCriador CHAR(36) NOT NULL,
                Titulo VARCHAR(200) NOT NULL,
                Descricao TEXT NULL,
                Status INT NOT NULL,
                Prioridade INT NOT NULL,
                VenceEm DATETIME(6) NULL,
                IniciadaEm DATETIME(6) NULL,
                ConcluidaEm DATETIME(6) NULL,
                IdTarefaPai CHAR(36) NULL
            );
        ");
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS SalasChat (
                Id CHAR(36) PRIMARY KEY,
                IdGrupo CHAR(36) NOT NULL,
                Nome VARCHAR(100) NOT NULL,
                Tipo INT NOT NULL
            );
        ");
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS MensagensChat (
                Id CHAR(36) PRIMARY KEY,
                IdSalaChat CHAR(36) NOT NULL,
                IdUsuarioRemetente CHAR(36) NOT NULL,
                Conteudo TEXT NOT NULL,
                EnviadaEm DATETIME(6) NOT NULL,
                EditadaEm DATETIME(6) NULL,
                ExcluidaEm DATETIME(6) NULL,
                RespostaParaIdMensagem CHAR(36) NULL
            );
        ");
        db.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS ConvitesGrupo (
                Id CHAR(36) PRIMARY KEY,
                IdGrupo CHAR(36) NOT NULL,
                IdUsuarioConvidante CHAR(36) NOT NULL,
                IdUsuarioConvidado CHAR(36) NULL,
                Email VARCHAR(256) NOT NULL,
                CodigoConvite VARCHAR(50) NOT NULL,
                Status INT NOT NULL,
                ExpiraEm DATETIME(6) NOT NULL,
                AceitoEm DATETIME(6) NULL
            );
        ");

        if (!db.Categorias.Any())
        {
            db.Categorias.AddRange(
                new Categoria { Nome = "Trabalho", Descricao = "Tarefas do dia a dia profissional", Cor = "#e63946", Ativa = true },
                new Categoria { Nome = "Estudo", Descricao = "Atividades escolares e cursos", Cor = "#4dabf7", Ativa = true },
                new Categoria { Nome = "Casa", Descricao = "Tarefas domésticas", Cor = "#51cf66", Ativa = true },
                new Categoria { Nome = "Pessoal", Descricao = "Compromissos pessoais", Cor = "#ffd43b", Ativa = true }
            );
            db.SaveChanges();
        }

        if (!db.Usuarios.Any())
        {
            db.Usuarios.Add(new Usuario
            {
                NomeCompleto = "Usuário Demo",
                Email = "demo@tarefaexpress.com",
                HashSenha = "123456",
                UrlAvatar = null,
                NumeroTelefone = null,
                Biografia = "Conta inicial criada para testar a aplicação.",
                Status = StatusUsuario.Ativo,
                UltimoLoginEm = DateTimeOffset.UtcNow
            });
            db.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(ex, "Erro ao criar/seed do banco. Verifique se o MySQL está acessível.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseCors("Frontend");
app.MapControllers();

app.Run();

