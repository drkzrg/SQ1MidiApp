function Person(prenom, nom, age, genre){
    this.prenom = prenom;
    this.nom = nom;
    this.age = age;
    this.genre = genre;

    this.greetings = function(){
        return 'Salut, je suis ' + this.prenom+ ' '+this.nom+'';
    }
}


var person1 = new Person('fred', 'oudjoudi', 37, 'homme' );

console.log(person1.greetings());
console.log(person1.__proto__.__proto__);

console.log(person1.__proto__ );

console.log(Person.__proto__);
