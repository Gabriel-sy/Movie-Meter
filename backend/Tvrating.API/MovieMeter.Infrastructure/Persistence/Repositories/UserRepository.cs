﻿using Microsoft.EntityFrameworkCore;
using MovieMeter.Core.Entities;
using MovieMeter.Core.Repositories;

namespace MovieMeter.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly MovieMeterDbContext _context;

    public UserRepository(MovieMeterDbContext context)
    {
        _context = context;
    }

    public async Task<User?> Register(User user)
    {
        var checkUserExists = await _context.Users.SingleOrDefaultAsync(u => u.Email == user.Email && !u.IsDeleted);

        if (checkUserExists is null)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return null;
        }
        
        return user;

    }

    public async Task<User?> GetUserByEmailAndPassword(string email, string password)
    {
        return await _context.Users.SingleOrDefaultAsync(u => u.Email == email &&
                                                                  u.Password == password &&
                                                                  !u.IsDeleted);
    }


    public async Task<User?> FindByEmail(string email)
    {
        return await _context.Users.SingleOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
    }

    public async Task<User?> FindById(int id)
    {
        return await _context.Users.SingleOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
    }
}