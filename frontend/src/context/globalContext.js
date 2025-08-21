import React, { useContext, useState } from "react"
import axios from 'axios'

const BASE_URL = 'https://budget-buddy-1-8h7u.onrender.com/api/v1';

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    // Add Income
    const addIncome = async (income) => {
        await axios.post(`${BASE_URL}/add-income`, income)
            .catch((err) =>{
                setError(err.response?.data?.message || "Error adding income")
            })
        getIncomes()
    }

    // Get Incomes
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/get-incomes`)
            setIncomes(response.data)
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching incomes")
        }
    }

    // Delete Income
    const deleteIncome = async (id) => {
        await axios.delete(`${BASE_URL}/delete-income/${id}`)
            .catch((err) => setError(err.response?.data?.message || "Error deleting income"))
        getIncomes()
    }

    // Total Income
    const totalIncome = () => {
        let total = 0;
        incomes.forEach((income) =>{
            total += income.amount
        })
        return total;
    }

    // Add Expense
    const addExpense = async (expense) => {
        await axios.post(`${BASE_URL}/add-expense`, expense)
            .catch((err) =>{
                setError(err.response?.data?.message || "Error adding expense")
            })
        getExpenses()
    }

    // Get Expenses
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/get-expenses`)
            setExpenses(response.data)
        } catch (err) {
            setError(err.response?.data?.message || "Error fetching expenses")
        }
    }

    // Delete Expense
    const deleteExpense = async (id) => {
        await axios.delete(`${BASE_URL}/delete-expense/${id}`)
            .catch((err) => setError(err.response?.data?.message || "Error deleting expense"))
        getExpenses()
    }

    // Total Expenses
    const totalExpenses = () => {
        let total = 0;
        expenses.forEach((expense) =>{
            total += expense.amount
        })
        return total;
    }

    // Total Balance
    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    // Transaction History
    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        return history.slice(0, 3)
    }

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}
