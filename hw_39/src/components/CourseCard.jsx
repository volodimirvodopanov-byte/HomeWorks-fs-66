import AvailabilityBadge from "./AvailabilityBadge.jsx";
import Card from "./Card.jsx";
function CourseCard({course}) {
    return (
        <Card>
            <h3>{course.title}</h3>
            <p>Преподаватель: {course.teacher}</p>
            <p>Продолжительность: {course.duration} ч.</p>
            <p>Стоимость: {course.price} $</p>
            <AvailabilityBadge isAvailable={course.isAvailable}/>
            {course.price > 400 && <p className="premium-label">Премиальный курс</p>}
        </Card>
    );
}

export default CourseCard;