using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Enums;


namespace TodoApp.DTOs
{
    public class CreateUpdateTodoDto
    {        
        public string Title { get; set; }
        public string Description { get; set; }
        public TodoStatus Status { get; set; }
        public TodoPriority Priority { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
