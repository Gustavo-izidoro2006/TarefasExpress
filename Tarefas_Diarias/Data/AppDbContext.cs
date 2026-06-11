using Microsoft.EntityFrameworkCore;
using TarefaExpress.Entities;

namespace TarefaExpress.Data;

// Contexto do Entity Framework Core para a aplicação.
// Representa uma "sessão" com o banco de dados e expõe os DbSets (tabelas).
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Grupo> Grupos => Set<Grupo>();
    public DbSet<ItemTarefa> ItemTarefas => Set<ItemTarefa>();
    public DbSet<MembroGrupo> MembrosGrupos => Set<MembroGrupo>();
    public DbSet<Cargo> Cargos => Set<Cargo>();
    public DbSet<Aviso> Avisos => Set<Aviso>();
    public DbSet<Advertencia> Advertencias => Set<Advertencia>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<SalaChat> SalasChat => Set<SalaChat>();
    public DbSet<MensagemChat> MensagensChat => Set<MensagemChat>();
    public DbSet<ConviteGrupo> ConvitesGrupo => Set<ConviteGrupo>();
    // Adicione outros DbSets conforme necessário

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Categoria
        modelBuilder.Entity<Categoria>(e => {
            e.HasKey(c => c.Id);
            e.Property(c => c.Id).ValueGeneratedOnAdd();
            e.Property(c => c.Nome).HasMaxLength(100).IsRequired();
        });

        // Usuario
        modelBuilder.Entity<Usuario>(e => {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.NomeCompleto).HasMaxLength(200);
            e.Property(u => u.Email).HasMaxLength(256);
        });

        // Grupo
        modelBuilder.Entity<Grupo>(e => {
            e.Property(g => g.Nome).HasMaxLength(100);
        });

        // Entidades com Guids de relacionamento — sem FK real para evitar erros no EnsureCreated
        modelBuilder.Entity<MembroGrupo>(e => {
            e.Property(m => m.IdGrupo).HasColumnType("char(36)");
            e.Property(m => m.IdUsuario).HasColumnType("char(36)");
            e.Property(m => m.IdCargo).HasColumnType("char(36)");
        });

        modelBuilder.Entity<Cargo>(e => {
            e.Property(c => c.IdGrupo).HasColumnType("char(36)");
        });

        modelBuilder.Entity<Aviso>(e => {
            e.Property(a => a.IdGrupo).HasColumnType("char(36)");
            e.Property(a => a.IdUsuarioCriador).HasColumnType("char(36)");
        });

        modelBuilder.Entity<Advertencia>(e => {
            e.Property(a => a.IdGrupo).HasColumnType("char(36)");
            e.Property(a => a.IdUsuarioEmissor).HasColumnType("char(36)");
            e.Property(a => a.IdUsuarioAlvo).HasColumnType("char(36)");
        });

        modelBuilder.Entity<ItemTarefa>(e => {
            e.Property(t => t.IdGrupo).HasColumnType("char(36)");
            e.Property(t => t.IdUsuarioCriador).HasColumnType("char(36)");
        });

        modelBuilder.Entity<SalaChat>(e => {
            e.Property(s => s.IdGrupo).HasColumnType("char(36)");
        });

        modelBuilder.Entity<MensagemChat>(e => {
            e.Property(m => m.IdSalaChat).HasColumnType("char(36)");
            e.Property(m => m.IdUsuarioRemetente).HasColumnType("char(36)");
        });

        modelBuilder.Entity<ConviteGrupo>(e => {
            e.Property(c => c.IdGrupo).HasColumnType("char(36)");
            e.Property(c => c.IdUsuarioConvidante).HasColumnType("char(36)");
            e.Property(c => c.IdUsuarioConvidado).HasColumnType("char(36)");
        });
    }
}

