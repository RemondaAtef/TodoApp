# Todo Management Application

A simple Todo Management application implemented using DDD principles,  built with ASP.NET Core 9, Entity Framework Core, ABP Framework, and Bootstrap.

## Features

- ✅ CRUD operations for todos
- ✅ Filter todos by status (Pending, InProgress, Completed)
- ✅ Mark todos as completed
- ✅ Priority levels (Low, Medium, High)
- ✅ Optional due date
- ✅ Basic validation: title required (max 100 chars), valid date fields
- ✅ Responsive Bootstrap UI
- ✅ Clean architecture following ABP framework principles

## Tech Stack

- ASP.NET Core 9
- Entity Framework Core
- ABP Framework
- Bootstrap (Frontend)
- SQL Server (Database)
- Node.js & Yarn (for frontend dependencies)

## Setup Instructions

### 1. Prerequisites

- [Visual Studio](https://visualstudio.microsoft.com/) or compatible IDE
- [.NET 9 SDK](https://dotnet.microsoft.com/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/)
- [Node.js (v20.11+)](https://nodejs.org/en)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- ABP CLI Tool (install globally):  
  ```bash
  dotnet tool install -g Volo.Abp.Studio.Cli

2. Configure Database
Update the connection strings in:

TodoApp.HttpApi.Host/appsettings.json
TodoApp.DbMigrator/appsettings.json

Make sure both point to your SQL Server instance.

3. Run Migrations
cd TodoApp.EntityFrameworkCore
dotnet ef database update

4. Run the Application
cd TodoApp.HttpApi.Host
dotnet run

Challenges Faced
🧠 Learning ABP’s structure and conventions
🔍 Aligning frontend and backend validation logic

Notes
ABP default authentication is used
Clean code practices applied
Error handling is implemented both in the UI and API layers
