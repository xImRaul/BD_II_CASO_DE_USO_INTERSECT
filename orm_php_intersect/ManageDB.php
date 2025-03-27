<?php
require_once 'DB.php';
class ManageBD extends DB {
    public function getQueries() {
        
        $conn = $this->connect();
        
        // Consultas a cada tabla de la base de datos
        $classroom = $conn->query("SELECT * FROM classroom");
        $course = $conn->query("SELECT * FROM course");
        $department = $conn->query("SELECT * FROM department");
        $instructor = $conn->query("SELECT * FROM instructor");
        $json_all = $conn->query("SELECT * FROM json_all");
        $section = $conn->query("SELECT * FROM section");
        
        // Almacenar las consultas en un array asociativo
        $queries = array(
            "classroom" => $classroom,
            "course" => $course,
            "department" => $department,
            "instructor" => $instructor,
            "json_all" => $json_all,
            "section" => $section
        );
        
        return $queries;
    }
}
?>
