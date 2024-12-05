import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db }  from './FirebaseConfig'

function AddAdditionalVocabForm() {
  const initialFormData = {
    id: '',
    wordJP: '',
    wordEN: '',
    descriptionText: '',
    structure: '',
    keyUses: [{ title: '', descriptionText: '' }],
    comparisons: [{ title: '', descriptionText: '' }],
    level: '',
    examples: [{ sentenceEN: '', sentenceJP: '' }]
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
        structure: formData.structure,
        keyUses: formData.keyUses,
        comparisons: formData.comparisons,
        level: formData.level,
        examples: formData.examples
      };

      // Save the data to Firestore
      await setDoc(doc(collection(db, 'additionalVocabs'), additionalVocabId), dataToSave);
      setFormData(initialFormData);
      alert("New Additional Vocab Saved")

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

        <h3>日本語:</h3>
        <input required type="text" name="wordJP" value={formData.wordJP} onChange={handleChange} /><br /><br />

        <h3>EN translation:</h3>
        <input required type="text" name="wordEN" value={formData.wordEN} onChange={handleChange} /><br /><br />

        <h3>Description:</h3>
        <textarea required name="descriptionText" value={formData.descriptionText} onChange={handleChange}></textarea><br /><br />

        <h3>Verb Structure:</h3>
        <textarea required name="structure" value={formData.structure} onChange={handleChange}></textarea><br /><br />

        <h3>Level:</h3>
        <input required type="text" name="level" value={formData.level} onChange={handleChange} /><br /><br />

        <h3>Key Uses:</h3>
        {formData.keyUses.map((use, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
          <input required
            type="text"
            placeholder="Title"
            value={use.title}
            onChange={(e) => handleKeyUseChange(index, 'title', e.target.value)}
          /><br/>
          <textarea required
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
            /><br/>
            <textarea required
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