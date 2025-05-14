import { faker, Faker } from "@faker-js/faker";
faker.locale='es';

const createMockProd=()=>{
    const categorias = ["comida","deporte","ropa","viajes","articulos para la casa"]
    const estado = [true,false];
    const title = faker.commerce.productName;
    const description = faker.commerce.productDescription;
    const code = faker.number.int({min:0, max:9999});
    const price = faker.number.int({min:1, max:8000});
    const status = true;
    const stock = faker.number.int({min:1, max:100});
    const category = categorias[faker.number.int({min:0,max:4})];
    const thumbnail = [];
    return {title,description,code,price,status,stock,category,thumbnail}
}

export default createMockProd;