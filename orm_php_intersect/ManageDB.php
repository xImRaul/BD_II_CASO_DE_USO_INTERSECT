<?php
require_once 'DB.php';

class ManageDB extends DB {
    public function getQueries() {
        $conn = $this->connect();
        
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        // Basic table queries
        $tableQueries = [
            'classroom',
            'course',
            'department',
            'instructor',
            'json_all',
            'section',
            'student',
            'takes',
            'teaches'
        ];

        $queries = [];

        foreach ($tableQueries as $table) {
            $result = $conn->query("SELECT * FROM $table");
            if ($result === false) {
                throw new Exception("Query failed for table: $table - " . $conn->error);
            }
            $queries[$table] = $result;
        }

        // Enhanced objectsAggregations query with proper JSON handling
        $objectsAggregations = $conn->query("
            SELECT 
                d.dept_name, 
                d.building, 
                d.budget,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'building', c.building, 
                            'room_number', c.room_number, 
                            'capacity', c.capacity
                        )
                    )
                    FROM classroom c 
                    WHERE c.building = d.building
                ) AS classrooms
            FROM department d
        ");

        if ($objectsAggregations === false) {
            throw new Exception("Query failed for objectsAggregations - " . $conn->error);
        }
        $queries['objectsAggregations'] = $objectsAggregations;

        return $queries;
    }
}