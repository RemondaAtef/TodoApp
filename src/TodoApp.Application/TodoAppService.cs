using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.DTOs;
using TodoApp.Entities;
using TodoApp.Enums;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace TodoApp
{
    public class TodoAppService : ApplicationService, ITodoAppService
    {
        private readonly IRepository<Todo, Guid> _todoRepo;
       
        public TodoAppService(IRepository<Todo, Guid> todoRepo)
        {
            _todoRepo = todoRepo;           
        }

        public async Task<TodoDto> CreateAsync(CreateUpdateTodoDto input)
        {
            if (string.IsNullOrEmpty(input.Title))
                throw new Exception("Title is required");


            var todo = ObjectMapper.Map<CreateUpdateTodoDto, Todo>(input);
            todo = await _todoRepo.InsertAsync(todo, autoSave: true);
            return ObjectMapper.Map<Todo, TodoDto>(todo);

        }

        public async Task<TodoDto> GetAsync(Guid id)
        {
            var todo = await _todoRepo.GetAsync(id);
            return ObjectMapper.Map<Todo, TodoDto>(todo);
        }

        public async Task<List<TodoDto>> GetAllAsync()
        {
            var todo = await _todoRepo.GetListAsync();
            return ObjectMapper.Map<List<Todo>, List<TodoDto>>(todo);
        }

        public async Task<List<TodoDto>> GetTodosByStatus(TodoStatus? status)
        {                     
            var todos = await _todoRepo.GetListAsync(t =>t.Status == status.Value);

            return ObjectMapper.Map<List<Todo>, List<TodoDto>>(todos);
        }

        public async Task<TodoDto> UpdateAsync(Guid id, CreateUpdateTodoDto input)
        {
            var todo = await _todoRepo.GetAsync(id);

            if (string.IsNullOrEmpty(input.Title))
                throw new Exception("Title is required");

            todo.Title = input.Title;
            todo.Description = input.Description;
            todo.Status = input.Status;
            todo.Priority = input.Priority;
            todo.DueDate = input.DueDate;
            todo.LastModifiedDate = DateTime.UtcNow;

            await _todoRepo.UpdateAsync(todo);
            return ObjectMapper.Map<Todo, TodoDto>(todo);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _todoRepo.DeleteAsync(id);
        }

        public async Task<TodoDto> MarkAsCompleteAsync(Guid id)
        {
            var todo = await _todoRepo.GetAsync(id);
            todo.Status = TodoStatus.Completed;
            todo.LastModifiedDate = DateTime.UtcNow;

            await _todoRepo.UpdateAsync(todo);
            return ObjectMapper.Map<Todo, TodoDto>(todo);
        }
    }
}
