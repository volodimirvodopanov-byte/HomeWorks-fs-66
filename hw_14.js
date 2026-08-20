let astronautName = "Yuri Gagarin"; 
let astronautAge = 34;              
let isCommander = true;             
let planet = "Mars";                
let missionDuration = 120;          


console.log("Имя:", astronautName);
console.log("Возраст:", astronautAge);
console.log("Командир:", isCommander);
console.log("Планета:", planet);
console.log("Длительность миссии (дни):", missionDuration);


let ageIn10Years = astronautAge + 10;
let newMissionDuration = missionDuration + 30;


console.log("Возраст через 10 лет:", ageIn10Years);
console.log("Длительность миссии после +30 дней:", newMissionDuration);



console.log("Астронавта зовут " + astronautName + ".");
console.log("Место назначения: планета " + planet + ".");
console.log("Статус командира: " + astronautName + " является командиром — " + isCommander + ".");


missionDuration = 200;
isCommander = false;


console.log("Новая длительность миссии (дни):", missionDuration);
console.log("Новый статус командира:", isCommander);