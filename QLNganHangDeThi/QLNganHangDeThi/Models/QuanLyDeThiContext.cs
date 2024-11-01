using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace QLNganHangDeThi.Models;

public partial class QuanLyDeThiContext : DbContext
{
    public QuanLyDeThiContext()
    {
    }

    public QuanLyDeThiContext(DbContextOptions<QuanLyDeThiContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Account { get; set; }
    public virtual DbSet<Decentralization> Decentralization { get; set; }
    public virtual DbSet<CauHoi> CauHois { get; set; }

    public virtual DbSet<DeThi> DeThis { get; set; }

    public virtual DbSet<HeDaoTao> HeDaoTaos { get; set; }

    public virtual DbSet<LoaiCauHoi> LoaiCauHois { get; set; }

    public virtual DbSet<MauDeThi> MauDeThis { get; set; }

    public virtual DbSet<MonHoc> MonHocs { get; set; }

    public virtual DbSet<MucDoKho> MucDoKhos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        if (!optionsBuilder.IsConfigured) {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlServer(connectionString);
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CauHoi>(entity =>
        {
            entity.HasKey(e => e.CauHoiId).HasName("PK__CauHoi__1937D77B512A4B51");

            entity.ToTable("CauHoi");

            entity.Property(e => e.CauHoiId).HasColumnName("CauHoiID");
            entity.Property(e => e.DapAn).HasColumnType("ntext");
            entity.Property(e => e.Diem).HasColumnType("decimal(4, 2)");
            entity.Property(e => e.LoaiId).HasColumnName("LoaiID");
            entity.Property(e => e.MonHocId).HasColumnName("MonHocID");
            entity.Property(e => e.MucDoId).HasColumnName("MucDoID");
            entity.Property(e => e.NoiDung).HasColumnType("ntext");

            entity.HasOne(d => d.Loai).WithMany(p => p.CauHois)
                .HasForeignKey(d => d.LoaiId)
                .HasConstraintName("FK__CauHoi__MaLoai__4222D4EF");

           

            entity.HasOne(d => d.MucDo).WithMany(p => p.CauHois)
                .HasForeignKey(d => d.MucDoId)
                .HasConstraintName("FK__CauHoi__MaMucDo__412EB0B6");
        });

       
        modelBuilder.Entity<DeThi>(entity =>
        {
            entity.HasKey(e => e.DeThiId).HasName("PK__DeThi__9F9645B076746A6B");

            entity.ToTable("DeThi");

            entity.Property(e => e.DeThiId).HasColumnName("DeThiID");
            entity.Property(e => e.MauDeId).HasColumnName("MauDeID");
            entity.Property(e => e.NgayTaoDe)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayThi).HasColumnType("date");
            entity.Property(e => e.TenLop).HasMaxLength(50);

            entity.HasOne(d => d.MauDe).WithMany(p => p.DeThis)
                .HasForeignKey(d => d.MauDeId)
                .HasConstraintName("FK__DeThi__MaMauDe__4CA06362");
        });

        modelBuilder.Entity<HeDaoTao>(entity =>
        {
            entity.HasKey(e => e.HeDtid).HasName("PK__HeDaoTao__0C0AE79436CCEB6B");

            entity.ToTable("HeDaoTao");

            entity.Property(e => e.HeDtid).HasColumnName("HeDTID");
            entity.Property(e => e.TenHeDt)
                .HasMaxLength(100)
                .HasColumnName("TenHeDT");
        });

        modelBuilder.Entity<LoaiCauHoi>(entity =>
        {
            entity.HasKey(e => e.LoaiId).HasName("PK__LoaiCauH__730A57591560A12A");

            entity.ToTable("LoaiCauHoi");

            entity.Property(e => e.LoaiId).HasColumnName("LoaiID");
            entity.Property(e => e.TenLoai).HasMaxLength(50);
        });

        modelBuilder.Entity<MauDeThi>(entity =>
        {
            entity.HasKey(e => e.MauDeId).HasName("PK__MauDeThi__487D9062835ED4D6");

            entity.ToTable("MauDeThi");

            entity.Property(e => e.MauDeId).HasColumnName("MauDeID");
            entity.Property(e => e.MonHocId).HasColumnName("MonHocID");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

           
        });

        modelBuilder.Entity<MonHoc>(entity =>
        {
            entity.HasKey(e => e.MonHocId).HasName("PK__MonHoc__4127737F245FAF89");

            entity.ToTable("MonHoc");

            entity.Property(e => e.MonHocId).HasColumnName("MonHocID");
            entity.Property(e => e.HeDtid).HasColumnName("HeDTID");
            entity.Property(e => e.TenMonHoc).HasMaxLength(100);

            
        });

        modelBuilder.Entity<MucDoKho>(entity =>
        {
            entity.HasKey(e => e.MucDoId).HasName("PK__MucDoKho__3EAECAA4AB3028F9");

            entity.ToTable("MucDoKho");

            entity.Property(e => e.MucDoId).HasColumnName("MucDoID");
            entity.Property(e => e.CapDo)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.MoTa).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
