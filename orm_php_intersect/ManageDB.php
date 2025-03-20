<?php
include_once 'DB.php';

class ManageBD extends DB {
    public function getQueries() {
        
        $conn = $this->connect();

        $json = $conn->query("SELECT * FROM mongodb_objects");
        $student_json = $conn->query("SELECT * FROM student_json");
        $courses = $conn->query("SELECT * FROM course");
        $takes = $conn->query("SELECT * FROM takes");

        $queries = array(
            "course" => $courses,
            "takes" => $takes,
            "json" => $json,
            "student_json" => $student_json
        );

        return $queries;
    }
}
?>
