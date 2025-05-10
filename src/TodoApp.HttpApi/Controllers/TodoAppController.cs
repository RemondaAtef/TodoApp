//using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using TodoApp.DTOs;
using TodoApp.Localization;
using Volo.Abp.AspNetCore.Mvc;
using TodoApp.Enums;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace TodoApp.Controllers;

/* Inherit your controllers from this class.
 */
//[Route("api/[controller]")]
[Route("api/app/todo")]
public abstract class TodoAppController : AbpControllerBase
{
    private readonly ITodoAppService _todoAppService;

    public TodoAppController(ITodoAppService todoAppService)
    {
        _todoAppService = todoAppService;
        LocalizationResource = typeof(TodoAppResource);
    }

    [HttpPost]     
    public async Task<ActionResult<TodoDto>> CreateAsync([FromBody]CreateUpdateTodoDto todo)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            return BadRequest(new { message = "Validation failed", errors });
        }
        var result = await _todoAppService.CreateAsync(todo);
        return  Ok(result);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<TodoDto>> GetAsync(Guid id)
    {
        var result = await _todoAppService.GetAsync(id);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<List<TodoDto>> GetAllAsync()
    {
        return await _todoAppService.GetAllAsync();
    }

    [HttpGet]
    public async Task<List<TodoDto>> GetListAsync([FromQuery] TodoStatus? status)
    {
        return await _todoAppService.GetTodosByStatus(status); 
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TodoDto>> UpdateAsync(Guid id, CreateUpdateTodoDto input)
    {
        var result = await _todoAppService.UpdateAsync(id, input);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task DeleteAsync(Guid id)
    {        
        await _todoAppService.DeleteAsync(id);
    }

    [HttpPut("{id}/complete")]
    public async Task<ActionResult<TodoDto>> MarkAsCompleteAsync(Guid id)
    {
        var result = await _todoAppService.MarkAsCompleteAsync(id);
        return result;
    }
}