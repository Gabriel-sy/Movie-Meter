using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieMeter.Infrastructure.Persistence
{
    /// <inheritdoc />
    public partial class updatereviewcolocandolistadenomesdeusuarioscomlikes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Likes",
                table: "Reviews",
                newName: "LikeAmount");

            migrationBuilder.AddColumn<string>(
                name: "LikeNames",
                table: "Reviews",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LikeNames",
                table: "Reviews");

            migrationBuilder.RenameColumn(
                name: "LikeAmount",
                table: "Reviews",
                newName: "Likes");
        }
    }
}
