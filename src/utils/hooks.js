// @ts-nocheck
import { useState, useEffect } from 'react';

export function useModal() {
	const [isOpen, setIsOpen] = useState(false);
	return [isOpen, setIsOpen];
}

/**
 * Hook to store and retrieve data from local storage.
 * When retrieving data from local storage, this hook will attempt to convert
 * strings that are numbers to actual numbers. This is useful for storing
 * numbers in local storage that are represented as strings.
 * @param {string} key The key to store/retrieve data from local storage.
 * @param {any} initialValue The initial value to store in local storage if
 * the key does not exist.
 * @return {Array} An array containing the stored value, and a function to
 * update the stored value.
 */
export function useLocalStorage(key, initialValue) {
	/**
	 * The current keys stored in local storage include:
	 * * user
	 * - name (string)
	 *
	 * * income
	 * - name (string)
	 * - amount (number)
	 * - date (string)
	 * - category (string)
	 * - desc (string)
	 * - id (automatically generated | string)
	 *
	 * * expenses
	 * - name (string)
	 * - amount (number)
	 * - date (string)
	 * - category (string)
	 * - desc (string)
	 * - id (automatically generated | string)
	 *
	 * * savings
	 * - name (string)
	 * - amount (number)
	 * - date (string)
	 * - category (string)
	 * - desc (string)
	 * - id (automatically generated | string)
	 *
	 * * incomeCategories
	 * - name (string)
	 *
	 * * savingsCategories
	 * - name (string)
	 * - tracked (boolean)
	 * - goal (number)
	 *
	 * * expensesCategories
	 * - name (string)
	 * - tracked (boolean)
	 * - startDate (string)
	 * - numberOfWeeks (number)
	 */
	const [storedValue, setStoredValue] = useState(() => {
		const data = JSON.parse(localStorage.getItem(key)) || initialValue;
		if (Array.isArray(data)) {
			const convertedArray = data.map((item) => {
				if (typeof item === 'string' && !isNaN(item)) {
					return Number(item);
				} else {
					return item;
				}
			});

			return convertedArray;
		} else {
			return data;
		}
	});

	useEffect(() => {
		// Setting data to localstorage
		localStorage.setItem(key, JSON.stringify(storedValue));
	}, [key, storedValue]);

	return [storedValue, setStoredValue];
}
