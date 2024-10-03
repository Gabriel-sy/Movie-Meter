namespace MovieMeter.Core.Services;

public class PagedList<T> : List<T>
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }

    public PagedList(IEnumerable<T> items, int pageNumber, int pageSize, int totalItems)
    {
        CurrentPage = pageNumber;
        TotalPages = (int) Math.Ceiling(totalItems / (double) pageSize);
        PageSize = pageSize;
        TotalItems = totalItems;
        
        AddRange(items);
    }

    public PagedList(IEnumerable<T> items, int currentPage, int totalPages, int pageSize, int totalItems)
    {
        CurrentPage = currentPage;
        TotalPages = totalPages;
        PageSize = pageSize;
        TotalItems = totalItems;
        
        AddRange(items);
    }
}