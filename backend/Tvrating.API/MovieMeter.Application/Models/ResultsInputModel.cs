namespace MovieMeter.Application.Models;

public class ResultsInputModel
{
    public int Page { get; set; }
    public List<ShowInputModel>? Results { get; set; }
}