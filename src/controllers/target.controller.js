import {pool} from "../db.js";

export const getTargets = async (req, res) => {
  try{
    const [result] = await pool.query("SELECT * FROM target");
    if (result.length <= 0) {
      return res.status(401).json({
        message: "No targets were found"
      });
    }
    res.json(result);
  }catch(error){
      return res.status(500).json({
        "message": "Something went wrong: " + error
      })
  }
};

export const getTarget = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM target WHERE id = ?",
      req.params.id
    );
    if (result.length <= 0) {
      return res.status(404).json({
        message: "Target not found",
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong :(",
    });
  }
};

export const createTarget = async (req, res) => {
  try {
    const { name, userId, targetCategoryId, targetAmount } = req.body;
    const [result] = await pool.query(
      "INSERT INTO target (name, user_id, target_category_id, target_amount) VALUES (?, ?, ?, ?)",
      [name, userId, targetCategoryId, targetAmount]
    );
    res.send({
      id: result.insertId,
      name,
      userId,
      targetCategoryId,
      targetAmount
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export const updateTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, userId, targetCategoryId, targetAmount } = req.body;
    const [result] = await pool.query(
      "UPDATE target SET name = IFNULL(?, name), user_id = IFNULL(?, user_id), target_category_id = IFNULL(?, target_category_id), target_amount = IFNULL(?, target_amount) WHERE id = ?",
      [name, userId, targetCategoryId, targetAmount, id]
    );
    if (result.affectedRows <= 0) {
      return res.status(404).json({
        message: "Target not found",
      });
    }

    const [target] = await pool.query("SELECT * FROM target WHERE id = ?", id);
    res.json(target[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteTarget = async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM target WHERE id = ?",
      req.params.id
    );
    if (result.affectedRows <= 0) {
      return res.status(404).json({
        message: "Target not found",
      });
    }
    res.status(204);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};