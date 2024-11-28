import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYKwDq5PZwwyfVfG9CSJ9l32MKnxFCvwg",
  authDomain: "jp-learning-app.firebaseapp.com",
  projectId: "jp-learning-app",
  storageBucket: "jp-learning-app.appspot.com",
  messagingSenderId: "1078421967934",
  appId: "1:1078421967934:ios:0d22fd3987f3b5e03fad6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [formData, setFormData] = useState({
    id: '',
    wordJP: '',
    wordJPKanji: '',
    wordEN: '',
    descriptionText: '',
    structurePositiveForms: [''],
    structureNegativeForms: [''],
    otherStructures: [
      {
        structureForm: '',
        examples: [
          { sentenceJP: '', sentenceEN: '' }
        ]
      }
    ],
    keyUses: [{ title: '', descriptionText: '' }],
    comparisons: [{ title: '', descriptionText: '' }],
    relatedVerbs: [''],
    level: '',
    isPremium: false
  });

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

  const handleStructureChange = (index, value) => {
    const updatedStructures = [...formData.otherStructures];
    updatedStructures[index].structureForm = value;
    setFormData(prevData => ({
      ...prevData,
      otherStructures: updatedStructures
    }));
  };

  const handleExampleChange = (structureIndex, exampleIndex, field, value) => {
    const updatedStructures = [...formData.otherStructures];
    updatedStructures[structureIndex].examples[exampleIndex][field] = value;
    setFormData(prevData => ({
      ...prevData,
      otherStructures: updatedStructures
    }));
  };

  const handleAddStructure = () => {
    setFormData(prevData => ({
      ...prevData,
      otherStructures: [...prevData.otherStructures, { structureForm: '', examples: [{ sentenceJP: '', sentenceEN: '' }] }]
    }));
  };

  const handleRemoveStructure = (index) => {
    const updatedStructures = formData.otherStructures.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      otherStructures: updatedStructures
    }));
  };

  const handleAddExample = (index) => {
    const updatedStructures = [...formData.otherStructures];
    updatedStructures[index].examples.push({ sentenceJP: '', sentenceEN: '' });
    setFormData(prevData => ({
      ...prevData,
      otherStructures: updatedStructures
    }));
  };

  const handleRemoveExample = (structureIndex, exampleIndex) => {
    const updatedStructures = [...formData.otherStructures];
    updatedStructures[structureIndex].examples = updatedStructures[structureIndex].examples.filter((_, i) => i !== exampleIndex);
    setFormData(prevData => ({
      ...prevData,
      otherStructures: updatedStructures
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)

    try {
      // Transform relatedVerbs into document references
      const relatedVerbsRefs = formData.relatedVerbs.map((verbId) =>
        doc(collection(db, 'vocabs'), verbId)
      );

      // Prepare the data for Firebase
      const dataToSave = {
        id: formData.id,
        wordJP: formData.wordJP,
        wordJPKanji: formData.wordJPKanji,
        wordEN: formData.wordEN,
        descriptionText: formData.descriptionText,
        structurePositiveForms: formData.structurePositiveForms,
        structureNegativeForms: formData.structureNegativeForms,
        otherStructures: formData.otherStructures,
        keyUses: formData.keyUses,
        comparisons: formData.comparisons,
        relatedVerbs: relatedVerbsRefs, // Store as references
        level: formData.level,
        isPremium: formData.isPremium, // Store as a boolean
      };

      // Save the data to Firestore
      await setDoc(doc(collection(db, 'vocabs'), formData.id), dataToSave);

      console.log('Data successfully saved to Firestore!');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
  };

  return (
    <div style={{ padding: '20px 40px'}}>
      <h1>Add Vocab Data to Firebase</h1>
      <form onSubmit={handleSubmit}>
        <h3>ID:</h3>
        <input required type="text" name="id" value={formData.id} onChange={handleChange} /><br /><br />

        <h3>Japanese Word:</h3>
        <input required type="text" name="wordJP" value={formData.wordJP} onChange={handleChange} /><br /><br />

        <h3>Japanese Word (Kanji):</h3>
        <input required type="text" name="wordJPKanji" value={formData.wordJPKanji} onChange={handleChange} /><br /><br />

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

        {formData.otherStructures.map((structure, structureIndex) => (
          <div key={structureIndex} style={{ marginBottom: '20px' }}>
            <h3>Other Structure {structureIndex + 1}:</h3>
            <label>Structure Form:</label>
            <input required
              type="text"
              value={structure.structureForm}
              onChange={(e) => handleStructureChange(structureIndex, e.target.value)}
            />
            <h4>Examples:</h4>
            {structure.examples.map((example, exampleIndex) => (
              <div key={exampleIndex} style={{ marginBottom: '10px' }}>
                <label>Sentence JP:</label>
                <input required
                  type="text"
                  value={example.sentenceJP}
                  onChange={(e) => handleExampleChange(structureIndex, exampleIndex, 'sentenceJP', e.target.value)}
                />
                <br />
                <label>Sentence EN:</label>
                <input required
                  type="text"
                  value={example.sentenceEN}
                  onChange={(e) => handleExampleChange(structureIndex, exampleIndex, 'sentenceEN', e.target.value)}
                />
                <button type="button" onClick={() => handleRemoveExample(structureIndex, exampleIndex)}>Remove Example</button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddExample(structureIndex)}>Add Example to Structure {structureIndex+1}</button><br /> <br />
            <button type="button" onClick={() => handleRemoveStructure(structureIndex)}>Remove Structure {structureIndex+1}</button>
          </div>
        ))}
        <button type="button" onClick={handleAddStructure}>Add New Other Structure</button>
        <br /><br />

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

        <h3>Level:</h3>
        <input required type="text" name="level" value={formData.level} onChange={handleChange} /><br /><br />

        <h3>Is Premium:</h3>
        <input style={{ width: "10px !important" }} type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} /><br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
