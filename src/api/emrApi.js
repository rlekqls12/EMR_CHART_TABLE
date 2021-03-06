import Axios from 'axios';

const EMR_SERVER_URL = process.env.SERVER_URL;
const GET_PATIENT_LIST = '/api/patient/list';
const GET_PATIENT_BRIEF = '/api/patient/brief/';
const GET_CHART_LIST = '/api/patient/stats';

const axios = Axios.create({
  baseURL: EMR_SERVER_URL
});

export default {
  async getPatientList(parameter) {
    let patientList = { list: [], page: 1, totalLength: 1 };
    try {
      const res = await axios.get(GET_PATIENT_LIST, { params: parameter });

      if (res.status === 200 && res.data.patient) {
        patientList = res.data.patient;
      }
    } catch (e) {}
  
    return patientList;
  },
  async getChartList() {
    let chartList = [];
    try {
      const res = await axios.get(GET_CHART_LIST);

      if (res.status === 200 && res.data.stats) {
        chartList = res.data.stats;
      }
    } catch (e) {}
  
    return chartList;
  },
  async getPatientBrief(person_id) {
    let data = { personId: null, conditionList: [], visitCount: 0 };
    if (!person_id) return data;

    try {
      const res = await axios.get(GET_PATIENT_BRIEF + person_id);

      if (res.status === 200 && res.data) {
        data = {
          ...res.data,
          personId: person_id
        };
      }
    } catch (e) {}
  
    return data;
  },
}