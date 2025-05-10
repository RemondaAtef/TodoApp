using System;
using System.Collections.Generic;
using System.Linq;

using TodoApp.Enums;


namespace TodoApp.DTOs
{
    public class TodoDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public TodoStatus Status { get; set; }
        public TodoPriority Priority { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
