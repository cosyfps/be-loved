export class Task {
    id_task!: number;                  // Identificador único de la tarea
    title!: string;                    // Título descriptivo de la tarea
    description!: string;              // Descripción detallada
    priority!: number;                 // Prioridad: 1 = Alta, 2 = Media, 3 = Baja
    due_date!: Date;                   // Fecha de vencimiento
    creation_date!: Date;              // Fecha de creación
    completion_date?: Date;            // Fecha de finalización (opcional)
    status!: number;                   // Estado: 1 = Pendiente, 2 = En progreso, 3 = Completada
    category_id!: number;              // Clave foránea que referencia a la tabla de categorías
    user_id!: number;                  // Clave foránea que referencia al usuario asignado
}