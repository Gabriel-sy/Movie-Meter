using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieMeter.Infrastructure.Persistence
{
    /// <inheritdoc />
    public partial class changereviewentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ShowOrigId",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowOrigId",
                table: "Reviews");
        }
    }
}
