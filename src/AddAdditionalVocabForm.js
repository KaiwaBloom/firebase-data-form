import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db }  from './FirebaseConfig'

function AddAdditionalVocabForm() {
  const initialFormData = {
    id: '',
    wordJP: '',
    wordEN: '',
    descriptionText: '',
    structurePositiveForms: [''],
    structureNegativeForms: [''],
    keyUses: [{ title: '', descriptionText: '' }],
    comparisons: [{ title: '', descriptionText: '' }],
    level: '',
    examples: [{ sentenceEN: '', sentenceJP: '' }],
    isPremium: false
  }
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleComparisonChange = (index, field, value) => {
    const updatedComparisons = [...formData.comparisons];
    updatedComparisons[index][field] = value;
    setFormData(prevData => ({
      ...prevData,
      comparisons: updatedComparisons
    }));
  };

  const handleAddComparison = () => {
    setFormData(prevData => ({
      ...prevData,
      comparisons: [...prevData.comparisons, { title: '', descriptionText: '' }]
    }));
  };

  const handleRemoveComparison = (index) => {
    const updatedComparisons = formData.comparisons.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      comparisons: updatedComparisons
    }));
  };

  const handleKeyUseChange = (index, field, value) => {
    const updatedKeyUses = [...formData.keyUses];
    updatedKeyUses[index][field] = value;
    setFormData(prevData => ({
      ...prevData,
      keyUses: updatedKeyUses
    }));
  };

  const handleAddKeyUse = () => {
    setFormData(prevData => ({
      ...prevData,
      keyUses: [...prevData.keyUses, { title: '', descriptionText: '' }]
    }));
  };

  const handleRemoveKeyUse = (index) => {
    const updatedKeyUses = formData.keyUses.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      keyUses: updatedKeyUses
    }));
  };

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

  const handleExampleChange = (exampleIndex, field, value) => {
    const updatedExamples = [...formData.examples];
    updatedExamples[exampleIndex][field] = value;
    setFormData({
      ...formData,
      examples: updatedExamples
    });
  };

  const handleAddExample = () => {
    const newExample = { sentenceJP: '', sentenceEN: '' }; // Empty example fields
    setFormData({
      ...formData,
      examples: [...formData.examples, newExample]
    });
  };

  const handleRemoveExample = (exampleIndex) => {
    const updatedExamples = formData.examples.filter((_, index) => index !== exampleIndex);
    setFormData({
      ...formData,
      examples: updatedExamples
    });
  };

  const validateForm = () => {
    const vocabIdPattern = /^\d{3}$/; 
    if (!vocabIdPattern.test(formData.id)) {
      setFormError('Additional Vocab ID must be exactly 3 letters.');
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

      const additionalVocabId = "A" + formData.id;

      // Prepare the data for Firebase
      const dataToSave = {
        id: additionalVocabId,
        wordJP: formData.wordJP,
        wordEN: formData.wordEN,
        descriptionText: formData.descriptionText,
        structurePositiveForms: formData.structurePositiveForms,
        structureNegativeForms: formData.structureNegativeForms,
        keyUses: formData.keyUses,
        comparisons: formData.comparisons,
        level: formData.level,
      };

      // Save the data to Firestore
      await setDoc(doc(collection(db, 'additionalVocabs'), additionalVocabId), dataToSave);
      setFormData(initialFormData);

      console.log('Data successfully saved to Firestore!');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px 40px'}}>
      <h1>Add Additional Vocab Data to Firebase</h1>
      <form onSubmit={handleSubmit}>
        <h3>Additional Vocab ID:</h3>
        <input required type="text" name="id" value={formData.id} onChange={handleChange} placeholder="001" /><br /><br />

        <h3>Japanese Word:</h3>
        <input required type="text" name="wordJP" value={formData.wordJP} onChange={handleChange} /><br /><br />

        <h3>English Word:</h3>
        <input required type="text" name="wordEN" value={formData.wordEN} onChange={handleChange} /><br /><br />

        <h3>Description:</h3>
        <textarea required name="descriptionText" value={formData.descriptionText} onChange={handleChange}></textarea><br /><br />

        <h3>Structure Positive Forms:</h3>
        {formData.structurePositiveForms.map((item, index) => (
          <div key={index}>
            <input required
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(e, index, 'structurePositiveForms')}
            />
            <button type="button" onClick={() => removeInputField('structurePositiveForms', index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addInputField('structurePositiveForms')}>+</button><br /><br />

        <h3>Structure Negative Forms:</h3>
        {formData.structureNegativeForms.map((item, index) => (
          <div key={index}>
            <input required
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(e, index, 'structureNegativeForms')}
            />
            <button type="button" onClick={() => removeInputField('structureNegativeForms', index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addInputField('structureNegativeForms')}>+</button><br /><br />

        <h3>Key Uses:</h3>
        {formData.keyUses.map((use, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
          <input required
            type="text"
            placeholder="Title"
            value={use.title}
            onChange={(e) => handleKeyUseChange(index, 'title', e.target.value)}
          />
          <input required
            type="text"
            placeholder="Description"
            value={use.descriptionText}
            onChange={(e) => handleKeyUseChange(index, 'descriptionText', e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemoveKeyUse(index)}
            style={{ marginLeft: '10px' }}
          >
            Remove
          </button>
        </div>
        ))}
        <button type="button" onClick={handleAddKeyUse}>
          Add Key Use
        </button><br /><br />

        <h3>Comparisons:</h3>
        {formData.comparisons.map((comparison, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input required
              type="text"
              placeholder="Title"
              value={comparison.title}
              onChange={(e) => handleComparisonChange(index, 'title', e.target.value)}
            />
            <input required
              type="text"
              placeholder="Description"
              value={comparison.descriptionText}
              onChange={(e) => handleComparisonChange(index, 'descriptionText', e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemoveComparison(index)}
              style={{ marginLeft: '10px' }}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddComparison}>
          Add Comparison
        </button><br /><br />

        <h3>Level:</h3>
        <input required type="text" name="level" value={formData.level} onChange={handleChange} /><br /><br />

        <h4>Examples:</h4>
        {formData.examples.map((example, exampleIndex) => (
          <div key={exampleIndex} style={{ marginBottom: '10px' }}>
            <label>Sentence JP:</label>
            <input
              required
              type="text"
              value={example.sentenceJP}
              onChange={(e) => handleExampleChange(exampleIndex, 'sentenceJP', e.target.value)}
            />
            <br />
            <label>Sentence EN:</label>
            <input
              required
              type="text"
              value={example.sentenceEN}
              onChange={(e) => handleExampleChange(exampleIndex, 'sentenceEN', e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveExample(exampleIndex)}>Remove Example</button>
          </div>
        ))}
        <button type="button" onClick={handleAddExample}>Add Example</button><br /><br />


        {formError && <p style={{ color: 'red' }}>{formError}</p>}

        <button type="submit" disabled={isSubmitting}>Submit</button>
      </form>
    </div>
  );
}
export default AddAdditionalVocabForm;