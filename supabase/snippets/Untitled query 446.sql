SELECT 
    sg.event_criteria_id,
    egc.type,
    egc.percentage, -- Bạn có thể lấy thêm các cột khác từ bảng criteria nếu cần
    AVG(sg.grade) AS average_grade,
    COUNT(sg.id) AS total_gradings
FROM submission_grading sg
JOIN event_grading_criteria egc ON sg.event_criteria_id = egc.id
WHERE egc.type = 'specific'
GROUP BY 
    sg.event_criteria_id, 
    egc.type,
    egc.percentage;