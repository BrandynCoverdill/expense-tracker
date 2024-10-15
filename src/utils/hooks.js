// @ts-nocheck
import {useState, useEffect} from 'react';

export function useModal() {
	const [isOpen, setIsOpen] = useState(false);
	return [isOpen, setIsOpen];
}

export function useLocalStorage(key, initialValue) {
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
