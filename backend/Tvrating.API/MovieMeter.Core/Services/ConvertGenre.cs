namespace MovieMeter.Core.Services;

public class ConvertGenre
{
    public static List<string> Convert(int[] genres)
    {
        List<string> newArr = [];
        for (var i = 0; i < genres.Length; i++)
        {
            switch (genres[i])
            {
               case 28:
                   newArr.Add("Ação");
                   break;
               case 12:
                   newArr.Add("Aventura");
                   break;
               case 16:
                   newArr.Add("Animação");
                   break;
               case 35:
                   newArr.Add("Comédia");
                   break;
               case 80:
                   newArr.Add("Crime");
                   break;
               case 99:
                   newArr.Add("Documentário");
                   break;
               case 18:
                   newArr.Add("Drama");
                   break;
               case 10751:
                   newArr.Add("Família");
                   break;
               case 14:
                   newArr.Add("Fantasia");
                   break;
               case 36:
                   newArr.Add("História");
                   break;
               case 27:
                   newArr.Add("Terror");
                   break;
               case 10402:
                   newArr.Add("Música");
                   break;
               case 9648:
                   newArr.Add("Mistério");
                   break;
               case 10749:
                   newArr.Add("Romance");
                   break;
               case 878:
                   newArr.Add("Ficção científica");
                   break;
               case 10770:
                   newArr.Add("Cinema TV");
                   break;
               case 53:
                   newArr.Add("Thriller");
                   break;
               case 10752:
                   newArr.Add("Guerra");
                   break;
               case 37:
                   newArr.Add("Faroeste");
                   break;
               default:
                   throw new InvalidDataException("Gênero inválido");
            }
        }

        return newArr;
    }
}