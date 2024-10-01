using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieMeter.Infrastructure.Persistence
{
    /// <inheritdoc />
    public partial class mudançanonomedatabelashows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shows_Users_UserId",
                table: "Shows");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Shows",
                table: "Shows");

            migrationBuilder.RenameTable(
                name: "Shows",
                newName: "Reviews");

            migrationBuilder.RenameIndex(
                name: "IX_Shows_UserId",
                table: "Reviews",
                newName: "IX_Reviews_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Users_UserId",
                table: "Reviews",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Users_UserId",
                table: "Reviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reviews",
                table: "Reviews");

            migrationBuilder.RenameTable(
                name: "Reviews",
                newName: "Shows");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_UserId",
                table: "Shows",
                newName: "IX_Shows_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Shows",
                table: "Shows",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Shows_Users_UserId",
                table: "Shows",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
