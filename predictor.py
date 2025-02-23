import cv2
import tensorflow as tf
import numpy as np


model = tf.keras.models.load_model('./model/skin_cancer_model.h5')


class Predictor():

    @classmethod
    def predict(self, path):
        image = cv2.imread(path, cv2.IMREAD_UNCHANGED)

        image = cv2.resize(image, (64, 64))
        #image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        #image = image / 255
        image = image.reshape(1, 64, 64, 3)

        #aux = np.array(image)
        #aux = aux.reshape((1, 64, 64, 3))

        predictions = model.predict(image)
        classIndex = np.argmax(predictions, axis=1)
        probabilityValue = np.amax(predictions)

        print(predictions)
        print(classIndex)
        print(probabilityValue)

        return classIndex[0], probabilityValue


