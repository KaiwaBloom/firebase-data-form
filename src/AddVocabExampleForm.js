import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db }  from './FirebaseConfig'

function AddVocabExampleForm() {
  const initialFormData = {
    vocabId: '',
    sentenceJP: '',
    sentenceJPKanji: '',
    sentenceEN: '',
    register: '',
    additionalVocabs: [''],
    alphabetSelection: ''
  }
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (e, index, arrayName) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index] = e.target.value;
    setFormData({
      ...formData,
      [arrayName]: updatedArray,
    });
  };

  // Add a new input field to an array
  const addInputField = (arrayName) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], ''],
    });
  };

  // Remove an input field from an array
  const removeInputField = (arrayName, index) => {
    const updatedArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [arrayName]: updatedArray,
    });
  };

  const validateForm = () => {
    const vocabIdPattern = /^\d{3}$/; 
    if (!vocabIdPattern.test(formData.vocabId)) {
      setFormError('Vocab ID must be exactly 3 letters.');
      return false;
    }
    const invalidAdditionalVocabs = formData.additionalVocabs.some(additionalId => 
      additionalId.trim() !== '' && !/^\d{3}$/.test(additionalId.trim())
    );
    
    if (invalidAdditionalVocabs) {
      setFormError('All additional vocab IDs must be exactly 3 digits.');
      return false;
    }
    setFormError(''); // Clear error message if validation passes
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    console.log(formData)
    setIsSubmitting(true);

    try {
      // Transform relatedVerbs into document references
      let additionalVocabRefs = [];
      if (formData.additionalVocabs.length > 0) {
        additionalVocabRefs = formData.additionalVocabs.map((additionalId) =>
          doc(collection(db, 'additionalVocabs'), 'A' + additionalId)
        );
      }

      const exampleId = "VE" + formData.vocabId + formData.alphabetSelection;
      const vocabId = "V" + formData.vocabId;

      const isPremium = Number(formData.vocabId) > 60;

      // Prepare the data for Firebase
      const dataToSave = {
        id: exampleId,
        vocabId: vocabId,
        sentenceJP: formData.sentenceJP,
        sentenceJPKanji: formData.sentenceJPKanji,
        sentenceEN: formData.sentenceEN,
        register: formData.register,
        additionalVocabs: additionalVocabRefs,
        isPremium: isPremium
      };

      // Save the data to Firestore
      await setDoc(doc(collection(db, 'vocabExamples'), exampleId), dataToSave);
      setFormData(initialFormData);

      console.log('Data successfully saved to Firestore!');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '10px 40px'}}>
      <h1>Add Vocab Example Data to Firebase</h1>
      <form onSubmit={handleSubmit}>
        <h3>Vocab ID:</h3>
        <input required type="text" name="vocabId" value={formData.vocabId} onChange={handleChange} placeholder='001' /><br /><br />

        <h3>Example Alphabet (A-H):</h3>
        <select
          name="alphabetSelection"
          value={formData.alphabetSelection}
          onChange={handleChange}
        >
          <option value="">Select a letter</option>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(letter => (
            <option key={letter} value={letter}>{letter}</option>
          ))}
        </select><br /><br />

        <h3>Japanese Sentence:</h3>
        <input required type="text" name="sentenceJP" value={formData.sentenceJP} onChange={handleChange} /><br /><br />

        <h3>Japanese Sentence (Kanji):</h3>
        <input required type="text" name="sentenceJPKanji" value={formData.sentenceJPKanji} onChange={handleChange} /><br /><br />

        <h3>English Sentence:</h3>
        <input required type="text" name="sentenceEN" value={formData.sentenceEN} onChange={handleChange} /><br /><br />

        <h3>Register:</h3>
        <input required type="text" name="register" value={formData.register} onChange={handleChange} /><br /><br />

        <h3>Additional Vocabs:</h3>
        {formData.additionalVocabs.map((item, index) => (
          <div key={index}>
            <input required
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(e, index, 'additionalVocabs')}
              placeholder='001'
            />
            <button type="button" onClick={() => removeInputField('additionalVocabs', index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addInputField('additionalVocabs')}>+</button><br /><br />

        {formError && <p style={{ color: 'red' }}>{formError}</p>}

        <button type="submit" disabled={isSubmitting}>Submit</button>
      </form>
    </div>
  );
}
export default AddVocabExampleForm;