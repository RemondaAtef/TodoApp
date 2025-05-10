using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.DTOs;
using TodoApp.Enums;
using Volo.Abp.Application.Services;


namespace TodoApp
{
    public interface ITodoAppService : IApplicationService
    {
        Task<TodoDto> CreateAsync(CreateUpdateTodoDto input);
        Task<TodoDto> GetAsync(Guid id);
        Task<List<TodoDto>> GetAllAsync();
        Task<List<TodoDto>> GetTodosByStatus(TodoStatus? status);
        Task<TodoDto> UpdateAsync(Guid id, CreateUpdateTodoDto input);
        Task DeleteAsync(Guid id);
        Task<TodoDto> MarkAsCompleteAsync(Guid id);
    }
}
