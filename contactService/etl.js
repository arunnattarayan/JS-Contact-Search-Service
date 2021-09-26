// This file contain methods which gonna deal with the operations for data convertion
import Contact from '../accessLayer/model';

export default class ETL {
  constructor(parent) {
    this.parent = parent;
    this.contactProbs = new Contact();
    this.props = {
      COUNTRY_CODE: '+1',
      INVALID_QUERY: 'The Search Query is not valid'
    }
  }

  generateName(modelData) {
    return `${modelData.nickName ? modelData.nickName : modelData.firstName} ${modelData.lastName}`.trim();
  }

  constructPhoneNumber(phoneNum) {
    if (!phoneNum) {
      return '';
    }
    phoneNum = phoneNum.replace(this.props.COUNTRY_CODE, '');
    phoneNum = this.parent.removeSpecialChars(phoneNum);
    return `(${phoneNum.slice(0, 3)}) ${phoneNum.slice(3, 6)}-${phoneNum.slice(6)}`;
  }

  generatePhones(modelData) {
    return [this.constructPhoneNumber(modelData.primaryPhoneNumber)
      , this.constructPhoneNumber(modelData.secondaryPhoneNumber)].filter(n => n);
  }

  generateAddress(md) {
    return `${md.addressLine1} ${md.addressLine2} ${md.addressLine3}`.trim()
      + `${md.city}`.trim()
      + `${md.state} ${md.zipCode}`.trim();
  }

  generateData(data) {
    let modelData = { ...this.contactProbs, ...data };
    return {
      name: this.generateName(modelData),
      phones: this.generatePhones(modelData),
      email: modelData.primaryEmail,
      address: this.generateAddress(modelData),
      id: modelData.id
    }
  }
}
