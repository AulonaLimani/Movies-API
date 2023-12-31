﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Entities;

namespace server.Controllers;

[ApiController]
[Route("api/ratings")]
public class RatingsController : ControllerBase
{
    private readonly ApplicationDbContext context;
    private readonly UserManager<IdentityUser> userManager;

    public RatingsController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
    {
        this.context = context;
        this.userManager = userManager;
    }

    /// <summary>
    /// Creates or updates a rating for a movie.
    /// </summary>
    /// <param name="ratingDto">The rating information.</param>
    /// <returns>A response with no content indicating the rating was successfully created or updated.</returns>
    /// <response code="204">The rating was successfully created or updated.</response>
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult> Post([FromBody] RatingDTO ratingDto)
    {
        var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
        var user = await userManager.FindByEmailAsync(email);
        var userId = user.Id;

        var currentRate =
            await context.Ratings.FirstOrDefaultAsync(x => x.MovieId == ratingDto.MovieId && x.UserId == userId);

        if (currentRate == null)
        {
            var rating = new Rating();
            rating.MovieId = ratingDto.MovieId;
            rating.Rate = ratingDto.Rating;
            rating.UserId = userId;
            context.Add(rating);
        }
        else
        {
            currentRate.Rate = ratingDto.Rating;
        }

        await context.SaveChangesAsync();
        return NoContent();
    }
}