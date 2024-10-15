using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieMeter.Infrastructure.Persistence
{
    /// <inheritdoc />
    public partial class remoçãodaclasseantigareviewparacentralizaremumasó : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropColumn(
                name: "MediaType",
                table: "Shows");

            migrationBuilder.DropColumn(
                name: "PublicRating",
                table: "Shows");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Shows",
                newName: "LikeNames");

            migrationBuilder.AddColumn<bool>(
                name: "IsLiked",
                table: "Shows",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "LikeAmount",
                table: "Shows",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLiked",
                table: "Shows");

            migrationBuilder.DropColumn(
                name: "LikeAmount",
                table: "Shows");

            migrationBuilder.RenameColumn(
                name: "LikeNames",
                table: "Shows",
                newName: "Title");

            migrationBuilder.AddColumn<string>(
                name: "MediaType",
                table: "Shows",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "PublicRating",
                table: "Shows",
                type: "decimal(3,2)",
                precision: 3,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ShowId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsLiked = table.Column<bool>(type: "bit", nullable: false),
                    LikeAmount = table.Column<int>(type: "int", nullable: false),
                    LikeNames = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rating = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReviewText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ShowOrigId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Shows_ShowId",
                        column: x => x.ShowId,
                        principalTable: "Shows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ShowId",
                table: "Reviews",
                column: "ShowId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");
        }
    }
}
