import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db }  from './FirebaseConfig'

function AddVocabForm() {
  const initialFormData = {
    id: '',
    wordJP: '',
    wordJPKanji: '',
    wordEN: '',
    descriptionText: '',
    structure: '',
    otherStructureForm: '',
    otherStructureExamples: [
      { sentenceJP: '', sentenceEN: '' }
    ],
    keyUses: [{ title: '', descriptionText: '' }],
    comparisons: [{ title: '', descriptionText: '' }],
    relatedVerbs: [''],
    level: ''
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
    const updatedExamples = [...formData.otherStructureExamples];
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
      otherStructureExamples: [...formData.otherStructureExamples, newExample]
    });
  };

  const handleRemoveExample = (exampleIndex) => {
    const updatedExamples = formData.otherStructureExamples.filter((_, index) => index !== exampleIndex);
    setFormData({
      ...formData,
      otherStructureExamples: updatedExamples
    });
  };

  const validateForm = () => {
    const vocabIdPattern = /^\d{3}$/; 
    if (!vocabIdPattern.test(formData.id)) {
      setFormError('Vocab ID must be exactly 3 letters.');
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
      const relatedVerbsRefs = formData.relatedVerbs.map((verbId) =>
        doc(collection(db, 'vocabs'), 'V' + verbId)
      );

      const vocabId = "V" + formData.id;
      const isPremium = Number(formData.id) > 60;

      // Prepare the data for Firebase
      let dataToSave = {
        id: vocabId,
        wordJP: formData.wordJP,
        wordJPKanji: formData.wordJPKanji,
        wordEN: formData.wordEN,
        descriptionText: formData.descriptionText,
        structure: formData.structure,
        level: formData.level,
        isPremium: isPremium
      };

      if (formData.otherStructureForm.trim() !== "") {
        dataToSave.otherStructureForm = formData.otherStructureForm;
        dataToSave.otherStructureExamples = formData.otherStructureExamples;
      }

      if (formData.keyUses.length > 0) {
        dataToSave.keyUses = formData.keyUses;
      }

      if (formData.comparisons.length > 0) {
        dataToSave.comparisons = formData.comparisons;
      }

      if (formData.relatedVerbs.length > 0) {
        dataToSave.relatedVerbs = relatedVerbsRefs;
      }

      // Save the data to Firestore
      await setDoc(doc(collection(db, 'vocabs'), vocabId), dataToSave);
      setFormData(initialFormData);

      console.log('Data successfully saved to Firestore!');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormError(''); // Clear any existing errors
  };

  return (
    <div style={{ padding: '20px 40px'}}>
      <h1>Add Vocab Data to Firebase</h1>
      <form onSubmit={handleSubmit}>
        <h3>ID:</h3>
        <input required type="text" name="id" value={formData.id} onChange={handleChange} placeholder="001" /><br /><br />

        <h3>日本語（ふりがな付き:</h3>
        <input required type="text" name="wordJP" value={formData.wordJP} onChange={handleChange} /><br /><br />

        <h3>日本語(ふりがな無し):</h3>
        <input required type="text" name="wordJPKanji" value={formData.wordJPKanji} onChange={handleChange} /><br /><br />

        <h3>EN translation:</h3>
        <input required type="text" name="wordEN" value={formData.wordEN} onChange={handleChange} /><br /><br />

        <h3>Description</h3>
        <textarea required name="descriptionText" value={formData.descriptionText} onChange={handleChange}></textarea><br /><br />
        
        <h3>Verb Structure:</h3>
        <textarea required name="structure" value={formData.structure} onChange={handleChange}></textarea><br /><br />

        <h3>Other Structure:</h3>
        <textarea name="otherStructureForm" value={formData.otherStructureForm} onChange={handleChange}></textarea><br /><br />

        <h3>Other Structure Examples:</h3>
        {formData.otherStructureExamples.map((example, exampleIndex) => (
          <div key={exampleIndex} style={{ marginBottom: '10px' }}>
            <input required
              type="text"
              placeholder='日本語文'
              value={example.sentenceJP}
              onChange={(e) => handleExampleChange(exampleIndex, 'sentenceJP', e.target.value)}
            />
            <br />
            <input required
              type="text"
              placeholder='英文'
              value={example.sentenceEN}
              onChange={(e) => handleExampleChange(exampleIndex, 'sentenceEN', e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveExample(exampleIndex)}>Remove Example</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddExample()}>Add Example</button><br /> <br />

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

        <h3>Related Verbs:</h3>
        {formData.relatedVerbs.map((item, index) => (
          <div key={index}>
            <input required
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(e, index, 'relatedVerbs')}
            />
            <button type="button" onClick={() => removeInputField('relatedVerbs', index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addInputField('relatedVerbs')}>+</button><br /><br />

        {formError && <p style={{ color: 'red' }}>{formError}</p>}

        <button type="submit" disabled={isSubmitting}>Submit</button>
        <button type="button" onClick={resetForm} disabled={isSubmitting}>Reset</button>
      </form>
    </div>
  );
}
export default AddVocabForm;