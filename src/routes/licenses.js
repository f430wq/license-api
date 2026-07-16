// =================================
// GET USER LICENSE
// =================================

router.post("/user", (req, res) => {

    const { discord_id } = req.body;

    if (!discord_id) {
        return res.status(400).json({
            success: false,
            message: "Missing discord_id"
        });
    }

    db.get(
        `
        SELECT *
        FROM licenses
        WHERE discord_id = ?
        `,
        [discord_id],
        (err, license) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (!license) {
                return res.json({
                    success: false,
                    message: "No license found"
                });
            }

            return res.json({
                success: true,
                license
            });

        }
    );

});

module.exports = router;
