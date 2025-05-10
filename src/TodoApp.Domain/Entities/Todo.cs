using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoApp.Enums;
using Volo.Abp.Domain.Entities;

namespace TodoApp.Entities
{
    public class Todo : AggregateRoot<Guid>
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        public string? Description { get; set; }

        public TodoStatus Status { get; set; }

        public TodoPriority Priority { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
    

   
}
