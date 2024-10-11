namespace MovieMeter.Application.Models;

public class EditReviewInputModel
{
    public int Id { get; set; }
    public decimal Rating { get; set; }
    public string Review { get; set; }
}