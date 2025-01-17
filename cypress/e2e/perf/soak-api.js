import http from 'k6/http';
import { sleep } from 'k6';

//Workload: 
export const options = {
  stages: [
    { duration: '5s', target: 5}, //Ramp-up, igual do averageLoad
    { duration: '1m', target: 5}, //Platô, por MUITO mais tempo que o averageLoad
    { duration: '5s', target: 0}, //Ramp-down, igual do averageLoad
  ]
};

//Casos de testes:
export default function() {
  http.get('https://test.k6.io'); //Entrando no endpoint
  sleep(1); //User thinking time
}
