namespace MovieMeter.Application.Models;

public class ShowInputModel
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Release_Date { get; set; }
    public int[]? Genre_Ids { get; set; }
    public double Vote_Average { get; set; }
    public string Media_Type { get; set; }
    public string? Name { get; set; }
    public string? Poster_Path { get; set; }
    public string Overview { get; set; }
    public string? First_Air_Date { get; set; }
    public string? DirectorName { get; set; }
    public string? Original_Title { get; set; }
    public string? Original_Name { get; set; }

}