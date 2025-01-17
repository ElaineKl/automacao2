import http from 'k6/http';
import { sleep } from 'k6';

//Workload: 
export const options = {
  stages: [
    { duration: '10s', target: 30}, //Ramp-up, maior quantidade de VUs possíveis
    { duration: '5s', target: 0}, //Ramp-down, igual do averageLoad
  ]
};

//Casos de testes:
export default function() {
  http.get('https://test.k6.io'); //Entrando no endpoint
  sleep(1); //User thinking time
}
