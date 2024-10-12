namespace MovieMeter.Application.Models;

public class ResultsInputModel
{
    public int Page { get; set; }
    public List<ShowInputModel>? Results { get; set; }
    public List<Person>? Crew { get; set; }
    public List<Person>? Cast { get; set; }
}