namespace MovieMeter.Core.Entities;

public class Comment : BaseEntity
{
    public Show Show { get; private set; }
    public int ShowId { get; private set; }
    public string Review { get; private set; }
    public int Likes { get; private set; }
}